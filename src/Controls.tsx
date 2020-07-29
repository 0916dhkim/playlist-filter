import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationDispatch, SignedInState } from "./store";

export  default function() {
  const tempoRange = useSelector((state: SignedInState) => state.tempoRange);
  const dispatch = useDispatch<ApplicationDispatch>();
  return (
    <div>
      <h3>Controls</h3>
      <span>Min Tempo</span>
      <input type="range" min={0} max={300} step={1} value={tempoRange[0]} onChange={(e) => {
        let parsed = parseFloat(e.target.value);
        if (Number.isNaN(parsed)) {
          parsed = 0;
        }
        dispatch({
          type: "SET_MIN_TEMPO",
          value: parsed
        });
      }} />
      <span>{tempoRange[0]}</span>
      <br />
      <span>Max Tempo</span>
      <input type="range" min={0} max={300} step={1} value={tempoRange[1]} onChange={(e) => {
        let parsed = parseFloat(e.target.value);
        if (Number.isNaN(parsed)) {
          parsed = 0;
        }
        dispatch({
          type: "SET_MAX_TEMPO",
          value: parsed
        });
      }} />
      <span>{tempoRange[1]}</span>
    </div>
  );
}
