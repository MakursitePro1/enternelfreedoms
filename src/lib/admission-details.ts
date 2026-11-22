// Read the existing private notes format without changing legacy records.
export function admissionParentDetails(notes: string | null) {
  const text = notes ?? '';
  const motherName = /^মায়ের পূর্ণ নাম: (.*)$/m.exec(text)?.[1] ?? '';
  const motherPhone = /^মায়ের মোবাইল নম্বর: (.*)$/m.exec(text)?.[1] ?? '';
  const consent = /^ভর্তির নোটিশ ও সকল শর্তাবলিতে সম্মতি: (.*)$/m.exec(text)?.[1] ?? '';
  const noteMarker = '\nঅভিভাবকের মন্তব্য / নোট: ';
  const markerIndex = text.indexOf(noteMarker);
  const structured = Boolean(motherName && motherPhone && consent);
  return { motherName, motherPhone, consent, guardianNote: structured ? (markerIndex < 0 ? '' : text.slice(markerIndex + noteMarker.length)) : text, structured };
}