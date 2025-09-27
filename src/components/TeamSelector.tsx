import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface TeamSelectorProps {
  onTeamChange: (teamId: string) => void;
}

export function TeamSelector({ onTeamChange }: TeamSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pay-per-use" | "team">("free");
  
  const teams = useQuery(api.teams.getUserTeams) || [];
  const createTeam = useMutation(api.teams.createTeam);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      const teamId = await createTeam({
        name: newTeamName.trim(),
        description: newTeamDescription.trim() || undefined,
        plan: selectedPlan,
      });
      
      toast.success("Team created successfully!");
      setShowCreateForm(false);
      setNewTeamName("");
      setNewTeamDescription("");
      setSelectedPlan("free");
      onTeamChange(teamId);
    } catch (error) {
      toast.error("Failed to create team");
      console.error(error);
    }
  };

  if (teams.length === 0 || showCreateForm) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Create Your Team</h3>
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name
            </label>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Research Team"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Market research for our startup"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Plan
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="free"
                  checked={selectedPlan === "free"}
                  onChange={(e) => setSelectedPlan(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <strong>Free</strong> - 10 queries/month
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pay-per-use"
                  checked={selectedPlan === "pay-per-use"}
                  onChange={(e) => setSelectedPlan(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <strong>Pay-per-Use</strong> - $2-5 per query
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="team"
                  checked={selectedPlan === "team"}
                  onChange={(e) => setSelectedPlan(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <strong>Team</strong> - Volume discounts
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Team
            </button>
            {teams.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <select
        onChange={(e) => onTeamChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        defaultValue={teams[0]?._id}
      >
        {teams.map((team) => (
          team && (
            <option key={team._id} value={team._id}>
              {team.name} ({team.plan})
            </option>
          )
        ))}
      </select>
      <button
        onClick={() => setShowCreateForm(true)}
        className="px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
      >
        + New Team
      </button>
    </div>
  );
}
