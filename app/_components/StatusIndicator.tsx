import React from "react";
import { MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md";

interface Props {
  isAccepted: boolean;
}

const StatusIndicator = ({ isAccepted }: Props) => {
  if (isAccepted) {
    return <MdOutlineCheckCircle className="text-sky-800 size-5" />;
  } else {
    return <MdOutlineCancel className="text-rose-700 size-5 " />;
  }
};

export default StatusIndicator;
