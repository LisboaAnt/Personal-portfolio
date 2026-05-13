"use server";

export type LabGreetState = { message: string } | null;

export async function labGreet(
  _prev: LabGreetState,
  formData: FormData,
): Promise<LabGreetState> {
  const raw = formData.get("name");
  const name = typeof raw === "string" && raw.trim() ? raw.trim() : "visitante";
  const time = new Date().toISOString().slice(11, 19);
  return { message: `${time} · ${name}` };
}
