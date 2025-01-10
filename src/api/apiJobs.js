// import supabaseClient from "@/utils/supabase";

// // Fetch Jobs
// export async function getJobs(token, { location, company_id, searchQuery }) {
//   const supabase = await supabaseClient(token);
//   let query = supabase
//     .from("jobs")
//     .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

//   if (location) {
//     query = query.eq("location", location);
//   }

//   if (company_id) {
//     query = query.eq("company_id", company_id);
//   }

//   if (searchQuery) {
//     query = query.ilike("title", `%${searchQuery}%`);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching Jobs:", error);
//     return null;
//   }

//   return data;
// }

// // Read Saved Jobs
// export async function getSavedJobs(token) {
//   const supabase = await supabaseClient(token);
//   const { data, error } = await supabase
//     .from("saved_jobs")
//     .select("*, job: jobs(*, company: companies(name,logo_url))");

//   if (error) {
//     console.error("Error fetching Saved Jobs:", error);
//     return null;
//   }

//   return data;
// }

// // Read single job
// export async function getSingleJob(token, { job_id }) {
//   const supabase = await supabaseClient(token);
//   let query = supabase
//     .from("jobs")
//     .select(
//       "*, company: companies(name,logo_url), applications: applications(*)"
//     )
//     .eq("id", job_id)
//     .single();

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching Job:", error);
//     return null;
//   }

//   return data;
// }

// // - Add / Remove Saved Job
// export async function saveJob(token, { alreadySaved }, saveData) {
//   const supabase = await supabaseClient(token);

//   if (alreadySaved) {
//     // If the job is already saved, remove it
//     const { data, error: deleteError } = await supabase
//       .from("saved_jobs")
//       .delete()
//       .eq("job_id", saveData.job_id);

//     if (deleteError) {
//       console.error("Error removing saved job:", deleteError);
//       return data;
//     }

//     return data;
//   } else {
//     // If the job is not saved, add it to saved jobs
//     const { data, error: insertError } = await supabase
//       .from("saved_jobs")
//       .insert([saveData])
//       .select();

//     if (insertError) {
//       console.error("Error saving job:", insertError);
//       return data;
//     }

//     return data;
//   }
// }

// // - job isOpen toggle - (recruiter_id = auth.uid())
// export async function updateHiringStatus(token, { job_id }, isOpen) {
//   const supabase = await supabaseClient(token);
//   const { data, error } = await supabase
//     .from("jobs")
//     .update({ isOpen })
//     .eq("id", job_id)
//     .select();

//   if (error) {
//     console.error("Error Updating Hiring Status:", error);
//     return null;
//   }

//   return data;
// }

// // get my created jobs
// export async function getMyJobs(token, { recruiter_id }) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .select("*, company: companies(name,logo_url)")
//     .eq("recruiter_id", recruiter_id);

//   if (error) {
//     console.error("Error fetching Jobs:", error);
//     return null;
//   }

//   return data;
// }

// // Delete job
// export async function deleteJob(token, { job_id }) {
//   const supabase = await supabaseClient(token);

//   const { data, error: deleteError } = await supabase
//     .from("jobs")
//     .delete()
//     .eq("id", job_id)
//     .select();

//   if (deleteError) {
//     console.error("Error deleting job:", deleteError);
//     return data;
//   }

//   return data;
// }

// // - post job
// export async function addNewJob(token, _, jobData) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .insert([jobData])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Error Creating Job");
//   }

//   return data;
// }
import supabaseClient from "@/utils/supabase";

// Helper to apply filters to queries
function applyFilters(query, filters) {
    if (filters.location) query = query.eq("location", filters.location);
    if (filters.company_id) query = query.eq("company_id", filters.company_id);
    if (filters.searchQuery) query = query.ilike("title", `%${filters.searchQuery}%`);
    return query;
}

// Fetch Jobs
export async function getJobs(token, filters) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);
        let query = supabase
            .from("jobs")
            .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

        query = applyFilters(query, filters);

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching Jobs:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error in getJobs:", err);
        return { success: false, error: err.message };
    }
}

// Read Saved Jobs
export async function getSavedJobs(token) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from("saved_jobs")
            .select("*, job: jobs(*, company: companies(name,logo_url))");

        if (error) {
            console.error("Error fetching Saved Jobs:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error in getSavedJobs:", err);
        return { success: false, error: err.message };
    }
}

// Read Single Job
export async function getSingleJob(token, { job_id }) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from("jobs")
            .select("*, company: companies(name,logo_url), applications: applications(*)")
            .eq("id", job_id)
            .single();

        if (error) {
            console.error("Error fetching Job:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error in getSingleJob:", err);
        return { success: false, error: err.message };
    }
}

// Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);

        if (alreadySaved) {
            const { data, error } = await supabase
                .from("saved_jobs")
                .delete()
                .eq("job_id", saveData.job_id);

            if (error) {
                console.error("Error removing saved job:", error);
                return { success: false, error };
            }

            return { success: true, data };
        } else {
            const { data, error } = await supabase
                .from("saved_jobs")
                .insert([saveData])
                .select();

            if (error) {
                console.error("Error saving job:", error);
                return { success: false, error };
            }

            return { success: true, data };
        }
    } catch (err) {
        console.error("Unexpected error in saveJob:", err);
        return { success: false, error: err.message };
    }
}

// Update Hiring Status
export async function updateHiringStatus(token, { job_id }, isOpen) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from("jobs")
            .update({ isOpen })
            .eq("id", job_id)
            .select();

        if (error) {
            console.error("Error Updating Hiring Status:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error in updateHiringStatus:", err);
        return { success: false, error: err.message };
    }
}

// Get My Created Jobs
export async function getMyJobs(token, { recruiter_id }) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from("jobs")
            .select("*, company: companies(name,logo_url)")
            .eq("recruiter_id", recruiter_id);

        if (error) {
            console.error("Error fetching My Jobs:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error in getMyJobs:", err);
        return { success: false, error: err.message };
    }
}

// Delete Job
export async function deleteJob(token, { job_id }) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from("jobs")
            .delete()
            .eq("id", job_id)
            .select();

        if (error) {
            console.error("Error deleting Job:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error in deleteJob:", err);
        return { success: false, error: err.message };
    }
}

// Add New Job
export async function addNewJob(token, _, jobData) {
    if (!token) {
        console.error("Error: Missing authentication token");
        return { success: false, error: "Missing token" };
    }

    try {
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from("jobs")
            .insert([jobData])
            .select();

        if (error) {
            console.error("Error creating Job:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error in addNewJob:", err);
        return { success: false, error: err.message };
    }
}
