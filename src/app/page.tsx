import HomeView from "@/components/HomeView";
import HomeForm from "./HomeForm";

export default function Home() {
  return <HomeView form={<HomeForm />} />;
}
