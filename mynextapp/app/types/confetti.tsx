import { type IProps } from "react-canvas-confetti";

export type IConfetti = NonNullable<
  Parameters<NonNullable<IProps["refConfetti"]>>[0]
>;
