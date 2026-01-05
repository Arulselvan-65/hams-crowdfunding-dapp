

export interface Campaign {
    projectId: number | null;
    title: string | null;
    fundingGoal: number | undefined;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
    imgUrl: string | null;
}