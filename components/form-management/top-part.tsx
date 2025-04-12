import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function TopPart() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col space-y-2">
        <p>Forms Management</p>
        <p>Manage your published forms and view submissions</p>
      </div>
      <div>
        <Button className="bg-[#4A90E2] hover:bg-[#4A90E2] flex transition-all duration-150 ">
          <Plus />
          Add Fields
        </Button>
      </div>
    </div>
  );
}
