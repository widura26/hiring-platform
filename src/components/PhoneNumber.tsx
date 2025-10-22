"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/countries";
import Flag from 'react-world-flags'

export default function PhoneNumber() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);
  const [phone, setPhone] = useState("");

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center border rounded-lg overflow-hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="rounded-none px-0 hover:bg-white w-fit justify-between border-0 shadow-none font-normal"
            >   
                <Flag code={selected.code} className="w-4 h-4 rounded-full object-cover object-center border border-[#E0E0E0]" />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8633 6.41992C10.8852 6.41992 10.9068 6.42443 10.9268 6.43262L10.9814 6.46875C10.9971 6.48424 11.0091 6.50314 11.0176 6.52344C11.0259 6.54361 11.0302 6.56508 11.0303 6.58691C11.0303 6.60891 11.026 6.63106 11.0176 6.65137L10.9814 6.70508L8.12207 9.53125L8.11816 9.53516C8.10278 9.55061 8.08456 9.56287 8.06445 9.57129C8.04414 9.57975 8.022 9.58398 8 9.58398C7.97804 9.58397 7.95582 9.57973 7.93555 9.57129C7.91547 9.56285 7.89719 9.55061 7.88184 9.53516L5.05176 6.70508C5.03636 6.68969 5.02401 6.67146 5.01562 6.65137C5.00716 6.63106 5.00293 6.60892 5.00293 6.58691C5.00296 6.56512 5.0073 6.54357 5.01562 6.52344C5.02405 6.50322 5.03624 6.4842 5.05176 6.46875H5.05273C5.08391 6.43776 5.12597 6.41998 5.16992 6.41992C5.21323 6.41992 5.25507 6.43671 5.28613 6.4668V6.46777L7.64648 8.82715L7.99805 9.17871L8.35156 8.83008L10.7441 6.46973L10.7461 6.46875C10.7773 6.43775 10.8193 6.41997 10.8633 6.41992Z" fill="#1D1F20" stroke="#1D1F20"/>
                </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandGroup>
                {countries.map((c:any) => (
                  <CommandItem
                    key={c.code}
                    value={c.name}
                    onSelect={() => {
                      setSelected(c);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4">
                        <Flag code={c.code} className="w-4 h-4 rounded-full object-cover border border-[#E0E0E0]" />
                      </div>
                      <span className="text-xs font-bold">{c.name}</span>
                    </div>
                    <span className="ml-auto text-muted-foreground">{c.dial_code}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="h-5 border-l mr-2 border-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="text-sm">{selected.dial_code}</div>
          <div className="">
            <input
              id="number"
              name="phone_number"
              type="tel"
              placeholder="81234567890"
              className="text-sm rounded-none p-0 flex-1 shadow-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
