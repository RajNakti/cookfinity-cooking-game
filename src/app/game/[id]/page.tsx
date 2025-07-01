import GamePageClient from './GamePageClient';

// Generate static params for static export
export async function generateStaticParams() {
  // Return a list of common recipe IDs for static generation
  // These are popular recipes that will be pre-generated
  return [
    { id: '715538' }, // Bruschetta with Mozzarella
    { id: '716429' }, // Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs
    { id: '644387' }, // Garlicky Kale
    { id: '715497' }, // Berry Bliss Smoothie
    { id: '715415' }, // Red Lentil Soup with Chicken and Turnips
    { id: '716406' }, // Asparagus and Pea Soup
    { id: '644826' }, // Chocolate Covered Cherry Cookies
    { id: '715446' }, // Slow Cooker Beef Stew
    { id: '782585' }, // Cannellini Bean and Asparagus Salad
    { id: '716627' }, // Easy Homemade Rice and Beans
  ];
}

export default function GamePage({ params }: { params: { id: string } }) {
  return <GamePageClient params={params} />;
}
