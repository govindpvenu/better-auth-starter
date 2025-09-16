import { getData } from "@/actions/todoAction";
import Header from "@/components/layout/header";
import Todos from "@/components/todos";

export default async function Home() {
  const data = await getData();
  return (
    <main className="">
      <Header />
      <Todos todos={data} />;
    </main>
  );
}
