import { mount } from "cypress/react";
import { atom } from "jotai";
import { ReactNode } from "react";
import { RangeInputMolecule } from "../../../state/rangeInput";
import AudioFeatureRangeInput from "./AudioFeatureRangeInput";

type TestContainerProps = {
  dark?: boolean;
  children?: ReactNode;
};

const TestContainer = ({ dark, children }: TestContainerProps) => (
  <div className={dark ? "dark" : ""} style={{ padding: "2rem" }}>
    {children}
  </div>
);

it("default", () => {
  const molecule: RangeInputMolecule = {
    name: "default",
    min: 0,
    minInputAtom: atom(0),
    max: 1,
    maxInputAtom: atom(1),
    errorAtom: atom((get) => undefined),
  };

  mount(
    <TestContainer>
      <AudioFeatureRangeInput molecule={molecule} />
    </TestContainer>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("dark", () => {
  const molecule: RangeInputMolecule = {
    name: "dark",
    min: 0,
    minInputAtom: atom(0),
    max: 1,
    maxInputAtom: atom(1),
    errorAtom: atom((get) => undefined),
  };

  mount(
    <TestContainer dark>
      <AudioFeatureRangeInput molecule={molecule} />
    </TestContainer>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("error", () => {
  const molecule: RangeInputMolecule = {
    name: "error",
    min: 0,
    minInputAtom: atom(0),
    max: 1,
    maxInputAtom: atom(1),
    errorAtom: atom((get) => "custom error"),
  };

  mount(
    <TestContainer>
      <AudioFeatureRangeInput molecule={molecule} />
    </TestContainer>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});

it("error dark", () => {
  const molecule: RangeInputMolecule = {
    name: "error",
    min: 0,
    minInputAtom: atom(0),
    max: 1,
    maxInputAtom: atom(1),
    errorAtom: atom((get) => "custom error"),
  };

  mount(
    <TestContainer dark>
      <AudioFeatureRangeInput molecule={molecule} />
    </TestContainer>
  );
  cy.argosScreenshot(Cypress.currentTest.title);
});
