//  ChatGPT prompt:
//  I have an app that shows a load of data each item has a specific category. I am going to color a circle for each category but need a set of hex codes that I can use for the categories, can you provide a javascript array of color codes of a large set of clean and simple colors that are not too bright and have a lot of variety and would work well on a white background?
export const CategoryColorCodes = [
  "#cecece", // grey is always used as the 'no category' color
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#7f7f7f", // gray
  "#bcbd22", // olive
  "#17becf", // cyan
  "#aec7e8", // light blue
  "#ffbb78", // light orange
  "#98df8a", // light green
  "#ff9896", // light red
  "#c5b0d5", // light purple
  "#c49c94", // light brown
  "#f7b6d2", // light pink
  "#c7c7c7", // light gray
  "#dbdb8d", // light olive
  "#9edae5", // light cyan
  "#393b79", // dark blue
  "#ff9896", // dark orange
  "#2ca02c", // dark green
  "#d62728", // dark red
  "#9467bd", // dark purple
  "#8c564b", // dark brown
  "#e377c2", // dark pink
  "#7f7f7f", // dark gray
  "#bcbd22", // dark olive
  "#17becf", // dark cyan
];

export abstract class CategoryColor {
  public static getColor(categories: string[], category: string): string {
    const colors = this.getColors(categories);
    return colors[category];
  }

  public static getColors(categories: string[]): Record<string, string> {
    const colors = [...new Set(categories.sort())].reduce(
      (acc: Record<string, string>, category: string, index: number) => {
        const arrayIndex = index % CategoryColorCodes.length;
        acc[categories[index]] = CategoryColorCodes[arrayIndex];
        return acc;
      },
      {},
    );
    return colors;
  }

  public static toEmojiAndName(category: string) {
    const emojiRex = /(\p{Emoji})(.*)/gu;
    const matches = category.matchAll(emojiRex);
    for (const match of matches) {
      return {
        emoji: match[1] || "",
        name: match[2] || "",
      };
    }

    return { emoji: "", name: category };
  }
}
