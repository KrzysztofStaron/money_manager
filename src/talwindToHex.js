import colors from "tailwindcss/colors";

export const talwindToHex = (name) => {
  return colors[name.split("-")[1]][name.split("-")[2]];
};

export const getRandomColor = () => {
  const colorsArray = Array.from(Object.keys(colors)).splice(3);
  const shades = [200, 300, 400, 500, 600, 700];

  const rName = () => {
    const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
    const name =
      "bg-" + color + "-" + shades[Math.floor(Math.random() * shades.length)];

    if (talwindToHex(name)) {
      return name;
    } else {
      return rName();
    }
  };

  return rName();
};
