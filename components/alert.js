import Container from "./container";
import cn from "classnames";
import { EXAMPLE_PATH } from "../lib/constants";

export default function Alert({ preview }) {
  return (
    <div
      className={cn("border-b", {
        "bg-accent-7 border-accent-7 text-white": preview,
        "bg-accent-1 border-accent-2": !preview,
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm">
          {preview ? (
            <>
              ✴︎ This is a Preview of gndclouds.cc{" "}
              <a
                href="https://gndclouds.cc"
                className="underline hover:text-cyan duration-200 transition-colors"
              >
                Click here
              </a>{" "}
              to exit preview mode.
            </>
          ) : (
            <>
              ✨ I'm half way through a refresh, you can find the last version
              at{" "}
              <a
                href="https://v6.gndclouds.cc"
                className="underline hover:text-success duration-200 transition-colors"
              >
                v6.gndclouds.cc
              </a>
              .
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
