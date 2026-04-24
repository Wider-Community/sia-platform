import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Building2, Users, FileText, Search } from "lucide-react";
import { searchAll, type SearchResult } from "../providers/typesense-search";

const iconMap = {
  organization: Building2,
  contact: Users,
  file: FileText,
};

export function CommandPalette() {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const r = await searchAll(value);
        setResults(r);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setOpen(false);
      setQuery("");
      setResults([]);
      navigate(result.href);
    },
    [navigate],
  );

  const grouped = {
    organizations: results.filter((r) => r.type === "organization"),
    contacts: results.filter((r) => r.type === "contact"),
    files: results.filter((r) => r.type === "file"),
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search organizations, contacts, files..."
        value={query}
        onValueChange={handleSearch}
      />
      <CommandList>
        {!query.trim() && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
              <Search className="h-8 w-8" />
              <p>Type to search across everything</p>
            </div>
          </CommandEmpty>
        )}
        {query.trim() && !isSearching && results.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {isSearching && (
          <CommandEmpty>Searching...</CommandEmpty>
        )}

        {grouped.organizations.length > 0 && (
          <CommandGroup heading="Organizations">
            {grouped.organizations.map((r) => {
              const Icon = iconMap[r.type];
              return (
                <CommandItem key={r.id} onSelect={() => handleSelect(r)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{r.title}</span>
                    {r.subtitle && <span className="text-xs text-muted-foreground">{r.subtitle}</span>}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {grouped.contacts.length > 0 && (
          <CommandGroup heading="Contacts">
            {grouped.contacts.map((r) => {
              const Icon = iconMap[r.type];
              return (
                <CommandItem key={r.id} onSelect={() => handleSelect(r)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{r.title}</span>
                    {r.subtitle && <span className="text-xs text-muted-foreground">{r.subtitle}</span>}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {grouped.files.length > 0 && (
          <CommandGroup heading="Files">
            {grouped.files.map((r) => {
              const Icon = iconMap[r.type];
              return (
                <CommandItem key={r.id} onSelect={() => handleSelect(r)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{r.title}</span>
                    {r.snippet && (
                      <span className="text-xs text-muted-foreground line-clamp-1">{r.snippet}</span>
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
