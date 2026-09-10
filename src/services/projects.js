import { supabase } from "./supabase.js";

export async function getUserProjects(userId) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ECO Projects Error:", error);
    return [];
  }

  return data || [];
}

export async function createProject(userId, name, description = "") {
  const cleanName = name.trim();

  if (!cleanName) {
    return {
      ok: false,
      message: "Project name is required."
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name: cleanName,
      description: description.trim()
    })
    .select()
    .single();

  if (error) {
    console.error("ECO Create Project Error:", error);

    return {
      ok: false,
      message: error.message
    };
  }

  return {
    ok: true,
    project: data
  };
}

export async function deleteProject(userId, projectId) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId);

  if (error) {
    console.error("ECO Delete Project Error:", error);

    return {
      ok: false,
      message: error.message
    };
  }

  return {
    ok: true
  };
}
