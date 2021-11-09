import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  link: string;
  text: string;
  icon: IconDefinition;
};
export default function NavigationItem({ link, text, icon }: Props) {
  return (
    <a
      href={link}
      className="gap-2 cursor-pointer px-4 hover:bg-base-100 horizontal-center w-full h-16 whitespace-nowrap uppercase rounded-3xl"
    >
      <FontAwesomeIcon
        icon={icon}
        className="text-color-100 w-6 flex-shrink-0"
      />
      <span className="pl-2">{text}</span>
    </a>
  );
}
