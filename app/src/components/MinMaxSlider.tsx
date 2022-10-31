import { ReactElement,useCallback, useEffect, useRef } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import "./MinMaxSlider.css";

type MinMaxSliderProps = {
  sliderMin: number;
  sliderMax: number;
  minAtom: PrimitiveAtom<number>;
  maxAtom: PrimitiveAtom<number>;
};
export default function MinMaxSlider({sliderMin,sliderMax,minAtom,maxAtom}:MinMaxSliderProps):ReactElement {
    const [minVal, setMinVal] = useAtom(minAtom);
    const [maxVal, setMaxVal] = useAtom(maxAtom);
    const minValRef = useRef(sliderMin);
    const maxValRef = useRef(sliderMax);
    const range = useRef<HTMLDivElement>(null);
    
    // Convert to percentage
    const getPercent = useCallback(
      (value:number) => Math.round(((value - sliderMin) / (sliderMax - sliderMin)) * 100),
      [ sliderMin,  sliderMax]
    );
  
    // Set width of the range to decrease from the left side **
    useEffect(() => {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxValRef.current);

  
      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }, [minVal, getPercent]);
  
    // Set width of the range to decrease from the right side 
    useEffect(() => {
      const minPercent = getPercent(minValRef.current);
      const maxPercent = getPercent(maxVal);
  
      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }, [maxVal, getPercent]);
  
    return (
      <div className="container">
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={minVal}
          step={sliderMax-sliderMin == 1 ? 0.1 : 1}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="thumb thumb--left"
        />
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={maxVal}
          step={sliderMax-sliderMin == 1 ? 0.1 : 1}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="thumb thumb--right"

        />
  
        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
          <div className="slider__left-value">{minVal}</div>
          <div className="slider__right-value">{maxVal}</div>
        </div>
      </div>
    );
}
