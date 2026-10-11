import Checkbox from '../Checkbox';

function FilterSection({ title, children }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-label-s font-semibold uppercase tracking-overline text-muted">{title}</p>
        {children}
      </div>
      <div className="h-px w-full bg-raised" />
    </div>
  );
}

function splitBand(label) {
  const match = label.match(/^(.*?)\s*\((.*)\)$/);

  return match ? { name: match[1], hint: match[2].replace(' - ', '–') } : { name: label };
}

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function FilterSidebar({ options, filters, days, onChange, onClear }) {
  const venues = [...options.venues].sort((a, b) => b.city.localeCompare(a.city) || a.id - b.id);
  const selectedVenues = venues.filter((venue) => filters.venues.includes(venue.slug));
  const availableFormats = selectedVenues.length
    ? options.formats.filter((format) =>
        selectedVenues.some((venue) => venue.formats.some((item) => item.slug === format.slug)),
      )
    : options.formats;
  const activeCount =
    filters.venues.length +
    filters.formats.length +
    filters.languages.length +
    filters.bands.length;

  function changeVenues(venue) {
    const nextVenues = toggle(filters.venues, venue.slug);
    const nextSelected = venues.filter((item) => nextVenues.includes(item.slug));
    const nextFormats = nextSelected.length
      ? filters.formats.filter((slug) =>
          nextSelected.some((item) => item.formats.some((format) => format.slug === slug)),
        )
      : filters.formats;

    onChange({ venues: nextVenues, formats: nextFormats });
  }

  return (
    <aside className="sticky top-6 flex flex-col justify-between overflow-clip rounded-2xl bg-card p-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-h3 font-extrabold">Filters</h2>
        <div className="flex flex-col gap-6">
          <FilterSection title="Venue">
            {venues.map((venue) => (
              <Checkbox
                key={venue.id}
                checked={filters.venues.includes(venue.slug)}
                onChange={() => changeVenues(venue)}
                label={venue.name}
                hint={venue.city}
              />
            ))}
          </FilterSection>

          <FilterSection title="Date">
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => onChange({ date: day.value })}
                  className={`flex h-13.5 w-9.25 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-1.5 py-2.5 text-label-s font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.2)] ${
                    filters.date === day.value ? 'bg-red' : 'bg-raised'
                  }`}
                >
                  <span>{day.weekday}</span>
                  <span>{day.day}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Format">
            {availableFormats.map((format) => (
              <Checkbox
                key={format.id}
                checked={filters.formats.includes(format.slug)}
                onChange={() => onChange({ formats: toggle(filters.formats, format.slug) })}
                label={format.name}
              />
            ))}
          </FilterSection>

          <FilterSection title="Language">
            {options.languages.map((language) => (
              <Checkbox
                key={language.id}
                checked={filters.languages.includes(language.slug)}
                onChange={() => onChange({ languages: toggle(filters.languages, language.slug) })}
                label={language.name}
              />
            ))}
          </FilterSection>

          <FilterSection title="Time of day">
            {options.timeBands.map((band) => {
              const { name, hint } = splitBand(band.label);

              return (
                <Checkbox
                  key={band.id}
                  checked={filters.bands.includes(band.id)}
                  onChange={() => onChange({ bands: toggle(filters.bands, band.id) })}
                  label={name}
                  hint={hint}
                />
              );
            })}
          </FilterSection>
        </div>
      </div>

      <div className="mt-15.25 flex flex-col items-center gap-3">
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="w-full cursor-pointer rounded-full border border-muted px-3 py-2.25 text-label-s font-semibold"
          >
            Clear filters
          </button>
        )}
        <p className="text-body-s text-muted">{activeCount} filters active</p>
      </div>
    </aside>
  );
}
