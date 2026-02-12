import { useEffect, useMemo, useState } from "react";
import { csrf, api } from "../lib/api";
import DashboardHeader from "../components/DashboardHeader";
import AddJobModal from "../components/AddJobModal";
import JobsCard from "../components/JobsCard";

export default function Dashboard() {
	const [jobs, setJobs] = useState([]);
	const [jobsLoading, setJobsLoading] = useState(true);
	const [statuses, setStatuses] = useState([]);
	const [statusesLoading, setStatusesLoading] = useState(true);
	const [form, setForm] = useState({
		company_name: "",
		job_title: "",
		status_id: 1,
		job_url: "",
		location: "",
		salary_range: "",
		applied_at: "",
		notes: "",
	});

	const [errors, setErrors] = useState({});
	const [isSaving, setIsSaving] = useState(false);

	const canSubmit = useMemo(() => {
		return form.company_name.trim() && form.job_title.trim() && form.status_id;
	}, [form]);

	const resetForm = () => {
		setForm({
			company_name: "",
			job_title: "",
			status_id: 1,
			job_url: "",
			location: "",
			salary_range: "",
			applied_at: "",
			notes: "",
		});
		setErrors({});
		setIsSaving(false);
	};

	const onChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const validate = () => {
		const next = {};
		if (!form.company_name.trim()) next.company_name = "Company is required.";
		if (!form.job_title.trim()) next.job_title = "Job title is required.";
		if (form.job_url && !/^https?:\/\//i.test(form.job_url.trim())) {
			next.job_url = "URL must start with http:// or https://";
		}
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		setIsSaving(true);

		try {
			await csrf(); // ✅ prevent 419

			const payload = {
				company_name: form.company_name.trim(),
				job_title: form.job_title.trim(),
				status_id: Number(form.status_id), // send as int
				job_url: form.job_url.trim() || null,
				location: form.location.trim() || null,
				salary_range: form.salary_range.trim() || null,
				applied_at: form.applied_at || null,
				notes: form.notes.trim() || null,
			};

			const created = await api("/api/applications", {
				method: "POST",
				body: JSON.stringify(payload),
			});

			// add the created record returned by Laravel
			setJobs((prev) => [created, ...prev]);

			// close modal
			const modalEl = document.getElementById("addJobModal");
			if (modalEl) {
				const modal = window.bootstrap?.Modal.getInstance(modalEl);
				modal?.hide();
			}

			resetForm();
		} catch (err) {
			console.error("Create application failed:", err);

			// Laravel validation errors come back as: { message, errors: {field: [msg]} }
			if (err?.errors) {
				const next = {};
				Object.entries(err.errors).forEach(([field, messages]) => {
					next[field] = messages?.[0] || "Invalid";
				});
				setErrors(next);
			} else {
				setErrors({ general: err?.message || "Failed to create application" });
			}
		} finally {
			setIsSaving(false);
		}
	};

	
	useEffect(() => {
		const loadStatuses = async () => {
			try {
				const res = await fetch("/api/application-statuses", {
					credentials: "include",
					headers: { Accept: "application/json" },
				});

				const data = await res.json();
				setStatuses(data);

				// If form doesn't have a status yet, default to the first one
				if (data.length) {
					setForm((prev) => ({
						...prev,
						status_id: prev.status_id || String(data[0].id),
					}));
				}
			} catch (e) {
				console.error("Failed to load statuses", e);
			} finally {
				setStatusesLoading(false);
			}
		};

		loadStatuses();
	}, []);
	
	useEffect(() => {
		const loadJobs = async () => {
			try {
				const data = await api("/api/applications", { method: "GET" });
				setJobs(data);
			} catch (e) {
				console.error("Failed to load applications", e);
			} finally {
				setJobsLoading(false);
			}
		};

		loadJobs();
	}, []);
	
	const statusNameById = useMemo(() => {
		const map = {};
		statuses.forEach((s) => {
			map[String(s.id)] = s.name;
		});
		return map;
	}, [statuses]);
	
	const STATUS_BADGE_CLASS = {
		Applied: "text-bg-primary",
		Interviewing: "text-bg-info",
		Offer: "text-bg-success",
		Rejected: "text-bg-danger",
		Ghosted: "text-bg-secondary",
	};

	return (
		<div className="container mt-4">
			
			{/* Header */}
			<DashboardHeader
				onAddClick={resetForm}
				addModalTarget="#addJobModal"
			/>

			{/* List */}
			<JobsCard
				jobsLoading={jobsLoading}
				jobs={jobs}
				addModalTarget="#addJobModal"
				addButtonText="Add your first job"
				onAddJobClick={resetForm}
				statusNameById={statusNameById}
				STATUS_BADGE_CLASS={STATUS_BADGE_CLASS}
			/>

			{/* Modal */}
			<AddJobModal
				form={form}
				errors={errors}
				statuses={statuses}
				statusesLoading={statusesLoading}
				isSaving={isSaving}
				canSubmit={canSubmit}
				onChange={onChange}
				onSubmit={handleSubmit}
				onReset={resetForm}
			/>
		</div>
	);
}
