import React, { ReactElement } from "react";
import {
  FaRocket,
  FaChartLine,
  FaCoins,
  FaPlaneArrival,
} from "react-icons/fa6";

interface Element {
  title: string;
  date: string;
  icon?: ReactElement;
  href?: string;
}

const elements: Element[] = [
  {
    title: "Bonding curve live",
    date: "2021-01-01",
    icon: <FaChartLine size={8} />,
  },
  { title: "Omen launched", date: "2021-01-01", icon: <FaRocket size={10} /> },
  { title: "Swapr launched", date: "2021-01-01", icon: <FaRocket size={10} /> },
  {
    title: "Treasury peak $50m 2022",
    date: "2021-01-01",
    icon: <FaCoins size={10} />,
  },
  { title: "DAVI launched", date: "2021-01-01", icon: <FaRocket size={10} /> },
  {
    title: "DAO closed",
    date: "2021-01-01",
    icon: <FaPlaneArrival size={10} />,
    href: "/close",
  },
];

const TimelineElement = ({ title, date, icon, href }: Element) => {
  return (
    <div
      className={`flex flex-col items-center max-w-20 group ${
        href && `hover:cursor-pointer`
      }`}
      onClick={() => href && window.open(href, "_self")}
    >
      <div className="rounded-full h-5 w-5 border border-slate-400 mb-1 flex items-center justify-center text-slate-400 group-hover:h-6 group-hover:w-6 group-hover:border-2 group-hover:border-slate-500 group-hover:text-slate-500 transition-all">
        {icon}
      </div>
      <span className="text-center text-slate-500 tracking-tighter leading-3 text-xs group-hover:font-medium">
        {title}
      </span>
    </div>
  );
};

const Timeline = () => {
  return (
    <div className="flex w-full justify-between mb-4 h-20">
      {elements.map((element, index) => (
        <div className="flex items-center" key={index}>
          <TimelineElement
            key={index}
            title={element.title}
            date={element.date}
            icon={element.icon}
            href={element.href}
          />
          {index !== elements.length - 1 && (
            <div className="w-20 h-px rounded bg-gradient-to-r from-transparent to-slate-500 mb-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
