import HelloWorldButton from "./components/hello-world-button/hello-world-button.js";
import Heading from "./components/heading/heading.js";

const heading = new Heading();

const helloWorldButton = new HelloWorldButton();

heading.render();

helloWorldButton.render();

// note: webpack set the variable based on mode: 'development' | 'production'
if (process.env.NODE_ENV === "production") {
  console.log("Production mode");
} else if (process.env.NODE_ENV === "development") {
  console.log("Development mode");
}

// note: on 'production' mode, the error is displayed from the bundle file if error exists
// note: on 'development' mode, the error is displayed more clearly from the js file if error exists
// helloWorldButton.methodThatDoesNotExists();
