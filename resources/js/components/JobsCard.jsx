import React from "react";

export default function JobsCard({
	jobsLoading,
	jobs,
	
	addModalTarget = "#addJobModal",
	addButtonText = "Add your first job",
	onAddJobClick,

	statusNameById,
	STATUS_BADGE_CLASS,
}) {
	// Loading
	if (jobsLoading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border" role="status" />
			</div>
		);
	}

	// Empty
	if (!jobs || jobs.length === 0) {
		return (
			<div className="card">
				<div className="card-body text-center py-5">
					<h2 className="h5 mb-2">No applications yet</h2>
					<p className="text-muted mb-3">Click "Add Job" to create your first entry.</p>

					<button
						className="btn btn-outline-primary"
						data-bs-toggle="modal"
						data-bs-target={addModalTarget}
						onClick={onAddJobClick}
					>
						{addButtonText}
					</button>
				</div>
			</div>
		);
	}

	// List
	return (
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
						{jobs.map((job) => {
							const statusName = statusNameById?.[String(job.status_id)] || "Unknown";
							const badgeClass = STATUS_BADGE_CLASS?.[statusName] || "text-bg-secondary";

							return (
								<tr key={job.id}>
									<td className="fw-semibold">{job.company_name}</td>
									<td>{job.job_title}</td>
									<td>
										<span className={`badge ${badgeClass}`}>{statusName}</span>
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
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);

}