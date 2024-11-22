import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

function App() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">URL original</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <Button>Encurtar URL</Button>
      </div>
    </>
  );
}

export default App;
