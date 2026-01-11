import { createClient } from "@/lib/supabase/server";
import { ClassesContent } from "@/components/admin/classes-content";

interface ClassItem {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
}

export default async function ClassesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("classes")
    .select("id, name, instructor, schedule, capacity, enrolled")
    .order("created_at", { ascending: false });

  const classes = (data || []) as ClassItem[];

  return <ClassesContent classes={classes} />;
}
