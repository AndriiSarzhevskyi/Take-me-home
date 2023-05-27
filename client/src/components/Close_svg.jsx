import React from "react"
export const CloseSvg = (props)=> {
    const closeHandler = event =>{
        event.preventDefault();
        const dialog = document.getElementById(props.id);
        dialog.close();
    }

    return (
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
        className="close"
        onClick={closeHandler}
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <path
            d="M1070 4050 c-13 -13 -20 -33 -20 -57 0 -36 23 -61 702 -740 l703
            -703 -703 -703 c-675 -675 -702 -703 -702 -739 0 -28 6 -42 26 -57 58 -46 27
            -73 784 684 l705 705 705 -705 c647 -647 708 -705 738 -705 44 0 82 38 82 82
            0 30 -58 91 -705 738 l-705 705 705 705 c757 757 730 726 684 784 -15 20 -29
            26 -57 26 -36 0 -64 -27 -739 -702 l-703 -703 -703 703 c-679 679 -704 702
            -740 702 -24 0 -44 -7 -57 -20z"
          />
        </g>
      </svg>
    );
}
