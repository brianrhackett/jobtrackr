import { useEffect, useMemo, useState } from "react";
import { csrf, api } from "../lib/api";

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
			<div className="d-flex align-items-center justify-content-between mb-3">
				<div>
					<h1 className="h3 mb-1">Dashboard</h1>
					<div className="text-muted">Track your job applications in one place.</div>
				</div>

				<button
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#addJobModal"
					onClick={() => {
						// ensure clean form whenever opened
						resetForm();
					}}
				>
					+ Add Job
				</button>
			</div>

			{/* List */}
			{jobsLoading ? (
				<div className="text-center py-5">
					<div className="spinner-border" role="status" />
				</div>
				) : jobs.length === 0 ? (
					<div className="card">
						<div className="card-body text-center py-5">
							<h2 className="h5 mb-2">No applications yet</h2>
							<p className="text-muted mb-3">
								Click “Add Job” to create your first entry.
							</p>
							<button
								className="btn btn-outline-primary"
								data-bs-toggle="modal"
								data-bs-target="#addJobModal"
								onClick={resetForm}
							>
								Add your first job
							</button>
						</div>
					</div>
				) : (
					<div className="card">
						<div className="table-responsive">
							<table className="table table-hover mb-0 align-middle">
								<thead className="table-light">
									<tr>
										<th>Company</th>
										<th>Title</th>
										<th>Status</th>
										<th style={{ width: 110 }}>Link</th>
									</tr>
								</thead>
								<tbody>
									{jobs.map( (job) => (
										<tr key={job.id}>
											<td className="fw-semibold">{job.company_name}</td>
											<td>{job.job_title}</td>
											<td>
												<span className={`badge ${
													STATUS_BADGE_CLASS[statusNameById[String(job.status_id)]] ||
													"text-bg-secondary"
												}`}>
													{statusNameById[String(job.status_id)] || "Unknown"}
												</span>
											</td>
											<td>
												{job.job_url ? (
													<a
														className="btn btn-sm btn-outline-secondary"
														href={job.job_url}
														target="_blank"
														rel="noreferrer"
													>
														View
													</a>
													) : (
													<span className="text-muted">—</span>
												)}
										</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)
			}

			{/* Modal */}
			<div
				className="modal fade"
				id="addJobModal"
				tabIndex="-1"
				aria-labelledby="addJobModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="addJobModalLabel">
							Add Job Application
							</h5>
							<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							onClick={resetForm}
							/>
						</div>

						<form onSubmit={handleSubmit}>
							<div className="modal-body">
								{errors.general && (
									<div className="alert alert-danger">{errors.general}</div>
								)}
								<div className="row g-3">
									<div className="col-md-6">
										<label className="form-label">Company *</label>
										<input
											name="company_name"
											className={`form-control ${errors.company_name ? "is-invalid" : ""}`}
											value={form.company_name}
											onChange={onChange}
										/>
										{errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
									</div>

									<div className="col-md-6">
										<label className="form-label">Job Title *</label>
										<input
											name="job_title"
											className={`form-control ${errors.job_title ? "is-invalid" : ""}`}
											value={form.job_title}
											onChange={onChange}
										/>
										{errors.job_title && <div className="invalid-feedback">{errors.job_title}</div>}
									</div>

									<div className="col-md-4">
										<label className="form-label">Status *</label>
											<select
												name="status_id"
												className={`form-select ${errors.status_id ? "is-invalid" : ""}`}
												value={form.status_id}
												onChange={onChange}
												disabled={statusesLoading}
											>
												{statusesLoading ? (
													<option value="">Loading...</option>
												) : (
													statuses.map((s) => (
														<option key={s.id} value={String(s.id)}>
															{s.name}
														</option>
													))
												)}
											</select>
											{errors.status_id && (
												<div className="invalid-feedback">{errors.status_id}</div>
											)}
									</div>

									<div className="col-md-8">
										<label className="form-label">Job URL</label>
										<input
											name="job_url"
											className="form-control"
											value={form.job_url}
											onChange={onChange}
											placeholder="https://..."
										/>
									</div>

									<div className="col-md-6">
										<label className="form-label">Location</label>
										<input
											name="location"
											className="form-control"
											value={form.location}
											onChange={onChange}
											placeholder="Remote, Detroit, Hybrid..."
										/>
									</div>

									<div className="col-md-6">
										<label className="form-label">Salary Range</label>
										<input
											name="salary_range"
											className="form-control"
											value={form.salary_range}
											onChange={onChange}
											placeholder="$70k–$90k"
										/>
									</div>

									<div className="col-md-6">
										<label className="form-label">Date Applied</label>
										<input
											type="date"
											name="applied_at"
											className="form-control"
											value={form.applied_at}
											onChange={onChange}
										/>
									</div>

									<div className="col-12">
										<label className="form-label">Notes</label>
										<textarea
											name="notes"
											className="form-control"
											rows={4}
											value={form.notes}
											onChange={onChange}
										/>
									</div>
								</div>
							</div>

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-outline-secondary"
									data-bs-dismiss="modal"
									onClick={resetForm}
									disabled={isSaving}
								>
									Cancel
								</button>

								<button
									type="submit"
									className="btn btn-primary"
									disabled={!canSubmit || isSaving}
								>
									{isSaving ? "Saving..." : "Add Job"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
