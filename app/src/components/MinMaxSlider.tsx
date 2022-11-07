import { ReactElement,useCallback} from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import "./MinMaxSlider.css";

type MinMaxSliderProps = {
  sliderMin: number;
  sliderMax: number;
  minInputAtom: PrimitiveAtom<number>;
  maxInputAtom: PrimitiveAtom<number>;
};
export default function MinMaxSlider({sliderMin,sliderMax,minInputAtom,maxInputAtom}:MinMaxSliderProps):ReactElement {
    const [minVal, setMinVal] = useAtom(minInputAtom);
    const [maxVal, setMaxVal] = useAtom(maxInputAtom);
    
    // Convert to percentage
    const getPercent = useCallback(
      (value:number) => Math.round(((value - sliderMin) / (sliderMax - sliderMin)) * 100),
      [ sliderMin,  sliderMax]
    );
  
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
          }}
          className="thumb thumb--right"
        />
  
        <div className="slider">
          <div className="slider__track" />
          <div className="slider__range" />
          <div className="slider__range" style={{ "--min-percent": getPercent(minVal), "--max-percent": getPercent(maxVal) }} />
          <div className="slider__left-value">{minVal}</div>
          <div className="slider__right-value">{maxVal}</div>
        </div>
      </div>
    );
}
