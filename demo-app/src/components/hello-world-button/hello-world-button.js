import "./hello-world-button.scss";

class HelloWorldButton {
  btnClassName = "hello-world-button";

  render() {
    const button = document.createElement("button");
    button.innerText = "Hello world";
    button.classList.add(this.btnClassName);

    button.onclick = function () {
      const p = document.createElement("p");
      p.innerText = "Hello World!";
      p.classList.add("hello-world-text");
      body.append(p);
    };

    const body = document.querySelector("body");
    body.append(button);
  }
}
export default HelloWorldButton;
