import {
  Observable,
  OperatorFunction,
  lastValueFrom,
  merge,
  partition,
  toArray,
} from "rxjs";

export function toPromise<T>(observable: Observable<T>): Promise<T[]> {
  return lastValueFrom(observable.pipe(toArray()));
}

/**
 * RxJS operator.
 *
 * Split the source observable into two observables with predicate.
 * Pipe each partition into corresponding operator & merge into single observable.
 */
export const partitionMerge =
  <TSource, TMatch extends TSource, TOut1, TOut2>(
    predicate: (value: TSource) => value is TMatch,
    operatorForMatched: OperatorFunction<TMatch, TOut1>,
    operatorForUnmatched: OperatorFunction<Exclude<TSource, TMatch>, TOut2>
  ) =>
  (observable: Observable<TSource>): Observable<TOut1 | TOut2> => {
    const [matched$, unmatched$] = partition(observable, predicate);
    return merge(
      matched$.pipe(operatorForMatched),
      unmatched$.pipe(operatorForUnmatched)
    );
  };

export function pairByKey<
  KeyName extends string | number | symbol,
  KeyType extends string | number | symbol,
  FirstElement extends {
    [K in KeyName]: KeyType;
  },
  SecondElement extends {
    [K in KeyName]: KeyType;
  }
>(
  firstObservable: Observable<FirstElement>,
  secondObservable: Observable<SecondElement>,
  keyName: KeyName
): Observable<[FirstElement, SecondElement]> {
  return new Observable<[FirstElement, SecondElement]>((subscriber) => {
    const firstMap: Map<string | number | symbol, FirstElement> = new Map();
    const secondMap: Map<string | number | symbol, SecondElement> = new Map();

    let firstComplete = false;
    let secondComplete = false;

    const firstSubscription = firstObservable.subscribe({
      next(first) {
        const key: string | number | symbol = first[keyName];
        const second = secondMap.get(key);
        if (second) {
          secondMap.delete(key);
          subscriber.next([first, second]);
        } else {
          firstMap.set(key, first);
        }
      },
      error(err) {
        subscriber.error(err);
      },
      complete() {
        if (secondComplete) {
          if (firstMap.size > 0 || secondMap.size > 0) {
            subscriber.error("There are unmatched elements.");
          } else {
            subscriber.complete();
          }
        } else {
          firstComplete = true;
        }
      },
    });
    const secondSubscription = secondObservable.subscribe({
      next(second) {
        const key: string | number | symbol = second[keyName];
        const first = firstMap.get(key);
        if (first) {
          firstMap.delete(key);
          subscriber.next([first, second]);
        } else {
          secondMap.set(key, second);
        }
      },
      error(err) {
        subscriber.error(err);
      },
      complete() {
        if (firstComplete) {
          if (firstMap.size > 0 || secondMap.size > 0) {
            subscriber.error("There are unmatched elements.");
          } else {
            subscriber.complete();
          }
        } else {
          secondComplete = true;
        }
      },
    });

    return () => {
      firstSubscription.unsubscribe();
      secondSubscription.unsubscribe();
    };
  });
}
