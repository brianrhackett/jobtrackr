import React from "react";

export default function DashboardHeader({
	title = "Dashboard",
	subtitle = "Track your job applications in one place.",
	onAddClick,
	addModalTarget = "#addJobModal",
	addButtonText = "+ Add Job",
}) {
	return (
		<div className="d-flex align-items-center justify-content-between mb-3">
			<div>
				<h1 className="h3 mb-1">{title}</h1>
				<div className="text-muted">{subtitle}</div>
			</div>

			<button
				className="btn btn-primary"
				data-bs-toggle="modal"
				data-bs-target={addModalTarget}
				onClick={onAddClick}
			>
				{addButtonText}
			</button>
		</div>
	);
}
