import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MapPin, Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Country, City } from "country-state-city";
import type { ICountry, ICity } from "country-state-city";
import { cn } from "@/lib/utils";

export interface OrgLocation {
  id: string;
  country: string;
  countryName: string;
  city: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

interface LocationEditorProps {
  value: OrgLocation[];
  onChange: (locations: OrgLocation[]) => void;
}

export function LocationEditor({ value, onChange }: LocationEditorProps) {
  const updateLocation = (
    index: number,
    patch: Partial<OrgLocation>
  ) => {
    const next = value.map((loc, i) => (i === index ? { ...loc, ...patch } : loc));
    onChange(next);
  };

  const setDefault = (index: number) => {
    onChange(
      value.map((loc, i) => ({ ...loc, isDefault: i === index }))
    );
  };

  const removeLocation = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((l) => l.isDefault)) {
      next[0].isDefault = true;
    }
    onChange(next);
  };

  const addLocation = () => {
    const isFirst = value.length === 0;
    onChange([
      ...value,
      {
        id: crypto.randomUUID(),
        country: "",
        countryName: "",
        city: "",
        lat: 0,
        lng: 0,
        isDefault: isFirst,
      },
    ]);
  };

  const handleCountrySelect = (index: number, c: ICountry) => {
    updateLocation(index, {
      country: c.isoCode,
      countryName: c.name,
      city: "",
      lat: 0,
      lng: 0,
    });
  };

  const handleCitySelect = (index: number, c: ICity) => {
    updateLocation(index, {
      city: c.name,
      lat: parseFloat(c.latitude ?? "0"),
      lng: parseFloat(c.longitude ?? "0"),
    });
  };

  const countries = Country.getAllCountries();

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <MapPin className="size-4" />
        Locations
      </Label>

      <div className="space-y-2">
        {value.map((loc, index) => (
          <LocationRow
            key={loc.id}
            location={loc}
            countries={countries}
            canRemove={value.length > 1}
            onCountrySelect={(c) => handleCountrySelect(index, c)}
            onCitySelect={(c) => handleCitySelect(index, c)}
            onSetDefault={() => setDefault(index)}
            onRemove={() => removeLocation(index)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addLocation}
        className="w-full"
      >
        <Plus className="size-4 mr-2" />
        Add Location
      </Button>
    </div>
  );
}

interface LocationRowProps {
  location: OrgLocation;
  countries: ICountry[];
  canRemove: boolean;
  onCountrySelect: (country: ICountry) => void;
  onCitySelect: (city: ICity) => void;
  onSetDefault: () => void;
  onRemove: () => void;
}

function LocationRow({
  location,
  countries,
  canRemove,
  onCountrySelect,
  onCitySelect,
  onSetDefault,
  onRemove,
}: LocationRowProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const cities = location.country
    ? City.getCitiesOfCountry(location.country) ?? []
    : [];

  return (
    <div className="flex items-center gap-2">
      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={countryOpen}
            className="w-[180px] justify-between text-sm font-normal"
          >
            <span className="truncate">
              {location.countryName || "Select country"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList className="max-h-[200px]">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((c) => (
                  <CommandItem
                    key={c.isoCode}
                    value={c.name}
                    onSelect={() => {
                      onCountrySelect(c);
                      setCountryOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "size-4 mr-2",
                        location.country === c.isoCode
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {c.flag} {c.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={cityOpen} onOpenChange={setCityOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={cityOpen}
            disabled={!location.country}
            className="w-[180px] justify-between text-sm font-normal"
          >
            <span className="truncate">
              {location.city || "Select city"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList className="max-h-[200px]">
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {cities.map((c, i) => (
                  <CommandItem
                    key={`${c.name}-${c.stateCode}-${i}`}
                    value={`${c.name} ${c.stateCode}`}
                    onSelect={() => {
                      onCitySelect(c);
                      setCityOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "size-4 mr-2",
                        location.city === c.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {c.name}
                    {c.stateCode ? `, ${c.stateCode}` : ""}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        variant={location.isDefault ? "default" : "outline"}
        size="sm"
        className="shrink-0 text-xs"
        onClick={onSetDefault}
      >
        {location.isDefault ? "Default" : "Set default"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        disabled={!canRemove}
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
