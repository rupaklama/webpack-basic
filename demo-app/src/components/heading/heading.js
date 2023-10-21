import "./heading.css";

class Heading {
  render() {
    const h1 = document.createElement("h1");
    const body = document.querySelector("body");

    h1.innerText = "Webpack is awesome!";
    body.appendChild(h1);
  }
}

export default Heading;
