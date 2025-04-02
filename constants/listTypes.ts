export interface ListType {
  type: string;
  subType: string[];
}

export const listTypes: ListType[] = [
  { type: "Front of House", subType: ["Fit to Frame"] },
  {
    type: "Interior Electric Box",
    subType: ["Close Up", "2 Steps Back", "Measurement of Wire Width"],
  },
  {
    type: "Water Meter",
    subType: ["2 Steps Back", "Measurement of Pipe Width"],
  },
  { type: "Sewer_Septic", subType: ["Close Up", "2 Steps Back"] },
  {
    type: "Sewer Grade Measurement",
    subType: [
      "Exterior foundation wall above grade",
      "Interior Foundation wall height",
      "Sewer pipe above slab",
    ],
  },
  {
    type: "Basement POV (Center)",
    subType: ["Facing North", "Facing South", "Facing East", "Facing West"],
  },
  {
    type: "Basement POV (Perimeter)",
    subType: ["Wall 1", "Wall 2", "Wall 3", "Wall 4"],
  },
  {
    type: "Exterior Electric Meter",
    subType: ["Close Up", "2 Steps Back", "Measurement of Wire Width"],
  },
  { type: "ADU Location", subType: ["General Area"] },
  {
    type: "ADU POV (Center)",
    subType: ["Facing North", "Facing South", "Facing East", "Facing West"],
  },
  {
    type: "End of Driveway",
    subType: ["Facing North", "Facing South", "Facing East", "Facing West"],
  },
  {
    type: "Box Staging Location",
    subType: ["Facing North", "Facing South", "Facing East", "Facing West"],
  },
  {
    type: "Crane Staging Location",
    subType: ["Facing North", "Facing South", "Facing East", "Facing West"],
  },
  { type: "Utility Servicing ADU", subType: ["Utility Servicing ADU"] },
  { type: "Obstacles", subType: ["Obstacles"] },
  { type: "Other Major Structures", subType: ["Other Major Structures"] },
  { type: "Transit Line Shot", subType: ["Transit Line Shot"] },
  { type: "Proposed Box Entrance", subType: ["Proposed Box Entrance"] },
  { type: "ADU Attachment Wall", subType: ["ADU Attachment Wall"] },
  { type: "Property POV (Center)", subType: ["Property POV (Center)"] },
  { type: "Property POV (Perimeter)", subType: ["Property POV (Perimeter)"] },
  { type: "Field Notes", subType: ["Field Notes"] },
  { type: "Other", subType: ["Other"] },
];
