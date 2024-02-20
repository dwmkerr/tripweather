export type EventCategory = {
  emoji: string;
  name: string;
};

export function ecFromString(category: string) {
  const emojiRex = /(\p{Emoji})\s*(.*)/gu;
  const matches = category.matchAll(emojiRex);
  for (const match of matches) {
    return {
      emoji: match[1] || "",
      name: match[2] || "",
    };
  }

  return { emoji: "", name: category };
}

export function ecToString(eventCategory: EventCategory) {
  return `${eventCategory.emoji !== "" ? `${eventCategory.emoji} ` : ""}${eventCategory.name}`;
}

export function ecUnique(eventCategories: EventCategory[]) {
  const categories = eventCategories.map(ecToString);
  const uniqueCategories = [...new Set(categories)];
  return uniqueCategories.map(ecFromString);
}

export function ecEquals(lhs: EventCategory, rhs: EventCategory) {
  return lhs.emoji === rhs.emoji && lhs.name === rhs.name;
}

export function ecContains(
  eventCategories: EventCategory[],
  eventCategory: EventCategory,
) {
  return (
    eventCategories.find(
      (ec) =>
        ec.emoji === eventCategory.emoji && ec.name === eventCategory.name,
    ) !== undefined
  );
}

export const ecEmpty = { emoji: "", name: "" };

export interface LifeEvent {
  userId: string;
  id: string;
  category: EventCategory;
  title: string;
  year: number;
  month: number | null;
  day: number | null;
  notes: string | null;
  minor: boolean;
}

export interface SerializableLifeEvent {
  userId: string;
  id: string;
  category: string;
  title: string;
  year: number;
  month: number | null;
  day: number | null;
  notes: string | null;
  minor: boolean;
}

export function toSerializableObject(event: LifeEvent): SerializableLifeEvent {
  return {
    ...event,
    category: `${event.category.emoji}${event.category.name}`,
  };
}

//  When we deserialize we are a little less strict - some fields are allowed
//  to be missing. This is because the model is growing over time and
//  historic records may not have all of the newer fields.
//  For this clever 'AtLeast' type see:
//  https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type MinimumSerializableLifeEvent = AtLeast<
  SerializableLifeEvent,
  "userId" | "id" | "title" | "year"
>;
export function fromSerializableObject(
  object: MinimumSerializableLifeEvent,
): LifeEvent {
  const eventCategory = ecFromString(object.category || "");
  //  Note that as well as deserializing, this code is also handling the logic
  //  for fields which might not be stored (for example fields which have been
  //  added to the extension since the puzzle was initially logged). This is
  //  also covered in the unit tests.
  return {
    ...object,
    category: eventCategory,
    month: object.month || null,
    day: object.day || null,
    notes: object.notes || null,
    minor: object.minor || false,
  };
}
