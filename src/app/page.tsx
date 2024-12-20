import { generateImage } from "./actions/generateImage";
import ImageGenerator from "./components/ImageGenerator";

export default function Home() {
  return <ImageGenerator generateImage={generateImage} />;
}
