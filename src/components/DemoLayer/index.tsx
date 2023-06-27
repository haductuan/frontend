import { useState } from "react";
import { useEffect } from "react";
import { sleep } from "src/utils/time";
import { TUTORIAL, ENABLE_TUTORIAL } from "src/configs/appConfig";
import { Box } from "@mui/system";
import Tour from "reactour";

const parseUlr = (paramName: string) => {
  let result = "";
  window.location.search
    .substring(1)
    .split("&")
    .forEach((item) => {
      const [param, value] = item.split("=");
      console.log(param, "-", value);
      if (param === paramName) {
        result = value;
      }
    });
  return result;
};

export function DemoLayer() {
  const [startIntro, setStartIntro] = useState<boolean>(false);

  useEffect(() => {
    const startDemo = async () => {
      const isDemoMode = parseUlr("demo");
      if (isDemoMode === "on" && ENABLE_TUTORIAL) {
        await sleep(3000);
        setStartIntro(true);
      }
    };
    startDemo();
  }, []);

  return (
    <Box>
      <Tour
        steps={TUTORIAL.steps}
        isOpen={startIntro}
        onRequestClose={() => {
          setStartIntro(false);
        }}
        closeWithMask={false}
        disableFocusLock={true}
      />
    </Box>
  );
}
