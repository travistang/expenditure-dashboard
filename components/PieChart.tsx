import { ResponsivePie, PieSvgProps } from "@nivo/pie";

type Props<T> = Partial<Omit<PieSvgProps<T>, "height" | "width">> & {
  data: T[];
};
export default function PieChart<T>({ data, ...props }: Props<T>) {
  return (
    <ResponsivePie
      innerRadius={0.8}
      padAngle={2}
      startAngle={-90}
      endAngle={90}
      colors={{ scheme: "greens" }}
      arcLinkLabelsDiagonalLength={-90}
      arcLinkLabelsStraightLength={2}
      arcLinkLabelsTextColor="#fff"
      data={data}
      {...props}
    />
  );
}
