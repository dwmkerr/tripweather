import { CategoryColorCodes, CategoryColor } from "./CategoryColor";

describe("CategoryColor", () => {
  describe("getColor", () => {
    test("can create a set of colors based on the sorted unique set of categories", async () => {
      const categories = ["", "Life", "Work", "Social", "Travel"];
      const colors = CategoryColor.getColors(categories);
      //  Note that the results are sorted and unique.
      expect(colors).toEqual({
        [""]: CategoryColorCodes[0],
        Life: CategoryColorCodes[1],
        Social: CategoryColorCodes[2],
        Travel: CategoryColorCodes[3],
        Work: CategoryColorCodes[4],
      });
    });

    test("can roll-over the color codes if there are too many categories", async () => {
      const tooManyColors = [...CategoryColorCodes, ...CategoryColorCodes];
      const tooManyCategories = tooManyColors.map(
        (color, index) => `Category ${index + 1} - ${color}`,
      );
      const firstColor = CategoryColor.getColor(
        tooManyCategories,
        tooManyCategories[0],
      );
      const firstRolledOverColor = CategoryColor.getColor(
        tooManyCategories,
        tooManyCategories[CategoryColorCodes.length + 1],
      );

      expect(firstColor).toEqual(CategoryColorCodes[0]);
      expect(firstRolledOverColor).toEqual(CategoryColorCodes[1]);
    });
  });

  describe("toEmojiAndName", () => {
    test("can extract the emoji and name from a category", () => {
      const { emoji, name } = CategoryColor.toEmojiAndName("🌎Travel");
      expect(emoji).toEqual("🌎");
      expect(name).toEqual("Travel");
    });
  });
});
