import classnames from "classnames";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

type Props = {
  link: string;
  text: string;
  icon: IconDefinition;
};
export default function NavigationItem({ link, text, icon }: Props) {
  const router = useRouter();
  const isInCurrentNavigation =
    link === "/" ? router.pathname === link : router.pathname.startsWith(link);
  return (
    <a
      href={link}
      className={classnames(
        "gap-2 rounded-full sm:rounded-none cursor-pointer sm:px-4 hover:bg-base-200 flex items-center justify-center sm:justify-start w-12 sm:w-full h-12 sm:h-16 whitespace-nowrap uppercase",
        isInCurrentNavigation && "sm:bg-base-300 sm:bg-opacity-40"
      )}
    >
      <FontAwesomeIcon
        icon={icon}
        className={classnames(
          "w-6 flex-shrink-0",
          isInCurrentNavigation && "text-primary sm:text-base-content"
        )}
      />
      <span className="pl-2 hidden md:block">{text}</span>
    </a>
  );
}
