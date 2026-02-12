import React from "react";

export default function AddJobModal({
	modalId = "addJobModal",
	title = "Add Job Application",

	// state + handlers from Dashboard
	form,
	errors,
	statuses,
	statusesLoading,
	isSaving,
	canSubmit,

	onChange,
	onSubmit,
	onReset,
}) {
	return (
		<div
			className="modal fade"
			id="{modalId}"
			tabIndex="-1"
			aria-labelledby={`${modalId}Label`}
			aria-hidden="true"
		>
			<div className="modal-dialog modal-lg modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id={`${modalId}Label`}>
							Add Job Application
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							onClick={onReset}
						/>
					</div>

					<form onSubmit={onSubmit}>
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
								onClick={onReset}
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
	);
}