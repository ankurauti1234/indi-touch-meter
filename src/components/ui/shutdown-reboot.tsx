"use client";

import { Power, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function ShutdownRebootControls() {
  return (
    <ButtonGroup>
      {/* ----------- SHUTDOWN BUTTON + DIALOG ------------ */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" aria-label="Shutdown">
            <Power className="h-4 w-4 text-red-500" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Shutdown Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to <strong>shutdown</strong> the device?
              <br />
              It will power off completely.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Shutdown
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------- REBOOT BUTTON + DIALOG ------------ */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" aria-label="Reboot">
            <RotateCcw className="h-4 w-4 text-yellow-500" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-yellow-600">Reboot Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to <strong>restart</strong> the device?
              <br />
              It will reboot and come back online in a moment.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Reboot
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ButtonGroup>
  );
}
