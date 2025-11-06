import SavedCategories from "@/src/features/bookmark/savedCategories";

export default function SavedCategoriesPage() {
      const categories = [
    {
      id: "1",
      name: "Funny Reels",
      reels: [
        { id: "r1", thumbnail: "https://example.com/thumb1.jpg" },
        { id: "r2", thumbnail: "https://example.com/thumb2.jpg" },
      ],
    },
    {
      id: "2",
      name: "Travel Reels",
      reels: [
        { id: "r3", thumbnail: "https://example.com/thumb3.jpg" },
      ],
    },
  ];
  return ( 
   <SavedCategories
      categories={categories}
      onSelect={(category) => console.log("Selected:", category)}
      onDelete={(id) => console.log("Deleted:", id)}
      onRename={(id, name) => console.log("Renamed:", id, name)}
    />
  )
}
