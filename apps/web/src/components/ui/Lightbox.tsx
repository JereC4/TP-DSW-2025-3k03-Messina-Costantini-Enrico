import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";

/** Modal para ver una foto en grande (foco atrapado, Escape, click afuera cierra). */
export function Lightbox({ src, alt, open, onClose }: { src: string; alt: string; open: boolean; onClose: () => void }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm" aria-hidden />
        </TransitionChild>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="ease-in duration-150" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
            <DialogPanel className="relative">
              <button type="button" onClick={onClose} className="absolute -top-3 -right-3 rounded-full bg-white p-1.5 text-stone-700 shadow-lg hover:bg-stone-100" aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
              <img src={src} alt={alt} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
