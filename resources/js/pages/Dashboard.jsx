import { useEffect, useMemo, useState, useRef } from "react";
import { Modal } from "bootstrap";
import { csrf, api } from "../lib/api";
import DashboardHeader from "../components/DashboardHeader";
import AddJobModal from "../components/AddJobModal";
import JobsCard from "../components/JobsCard";

const INITIAL_FORM = {
	company_name: "",
	job_title: "",
	status_id: "",
	job_url: "",
	location: "",
	salary_range: "",
	applied_at: "",
	notes: "",
};

export default function Dashboard() {
	const [jobs, setJobs] = useState([]);
	const [jobsLoading, setJobsLoading] = useState(true);
	const [statuses, setStatuses] = useState([]);
	const [statusesLoading, setStatusesLoading] = useState(true);
	const [form, setForm] = useState(INITIAL_FORM);
	const addModalRef = useRef(null);
	const ADD_MODAL_TARGET = "#addJobModal";
	const [errors, setErrors] = useState({});
	const [isSaving, setIsSaving] = useState(false);
	const [editingJobId, setEditingJobId] = useState(null);
	
	const canSubmit = useMemo(() => {
		return form.company_name.trim() && form.job_title.trim() && form.status_id;
	}, [form]);

	const resetForm = () => {
		setEditingJobId(null);
		setErrors({});
		setForm({
			...INITIAL_FORM,
			status_id: statuses.length ? String(statuses[0].id) : "",
		});
	};

	const onChange = (e) => {
		const { name, value } = e.target;
		console.log("changing field:", name, value);
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
	function openAddModal() {
		resetForm();

		const el = addModalRef.current;
		if (!el) return;

		const instance = Modal.getOrCreateInstance(el);
		instance.show();
	}

	function openEditModal(job) {
		handleEdit(job);

		const el = addModalRef.current;
		if (!el) return;

		const instance = Modal.getOrCreateInstance(el);
		instance.show();
	}
	
	function closeAddModal() {
		const el = addModalRef.current;
		if (!el) return;

		const instance = Modal.getOrCreateInstance(el);
		instance.hide();
	}

	function handleEdit(job) {
		setEditingJobId(job.id);
		setErrors({}); // or however you reset errors

		setForm({
			company_name: job.company_name ?? "",
			job_title: job.job_title ?? "",
			status_id: String(job.status_id ?? ""),
			job_url: job.job_url ?? "",
			location: job.location ?? "",
			salary_range: job.salary_range ?? "",
			applied_at: job.applied_at ? String(job.applied_at).slice(0, 10) : "",
			notes: job.notes ?? "",
		});
	}
	
	async function handleDelete(job) {
		const ok = window.confirm(`Delete ${job.company_name} - ${job.job_title}?`);
		if (!ok) return;

		try {
			// adjust endpoint to match your API
			await api(`/api/applications/${job.id}`, {
				method: "DELETE",
			});
			await fetchJobs();
		} catch (err) {
			console.error(err);
			alert("Failed to delete job. Please try again.");
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setErrors({});

		try {
			setIsSaving(true);

			if (editingJobId) {
				await api(`/api/applications/${editingJobId}`, {
					method: "PUT",
					body: JSON.stringify(form),
				});
			} else {
				await api("/api/applications", {
					method: "POST",
					body: JSON.stringify(form),
				});
			}
			
			await fetchJobs();
			closeAddModal();
		} catch (err) {
			console.error(err);
			if (err.response?.status === 422) {
				setErrors(err.response.data.errors || {});
			} else {
				setErrors({
					general: "Something went wrong. Please try again.",
				});
			}
		} finally {
			setIsSaving(false);
		}
	}

	useEffect(() => {
		const el = addModalRef.current;
		if (!el) return;

		const onHidden = () => {
			setErrors({});
			setEditingJobId(null);
			setForm({
				...INITIAL_FORM,
				status_id: statuses.length ? String(statuses[0].id) : "",
			});
		};

		el.addEventListener("hidden.bs.modal", onHidden);

		return () => {
			el.removeEventListener("hidden.bs.modal", onHidden);
		};
	}, [statuses]);
	
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
	
	const fetchJobs = async () => {
		try {
			setJobsLoading(true);
			const data = await api("/api/applications", { method: "GET" });
			setJobs(data);
		} catch (e) {
			console.error("Failed to load applications", e);
		} finally {
			setJobsLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs();
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
				onAddClick={openAddModal}
			/>

			{/* List */}
			<JobsCard
				jobsLoading={jobsLoading}
				jobs={jobs}
				addModalTarget={ADD_MODAL_TARGET}
				onAddJobClick={resetForm}
				statusNameById={statusNameById}
				STATUS_BADGE_CLASS={STATUS_BADGE_CLASS}
				onEdit={openEditModal}
				onDelete={handleDelete}
			/>

			{/* Modal */}
			<AddJobModal
				modalRef={addModalRef}
				modalId={ADD_MODAL_TARGET.replace("#", "")}
				form={form}
				errors={errors}
				statuses={statuses}
				statusesLoading={statusesLoading}
				isSaving={isSaving}
				canSubmit={canSubmit}
				onChange={onChange}
				onSubmit={handleSubmit}
				onReset={resetForm}
				editingJobId={editingJobId}
			/>
		</div>
	);
}
