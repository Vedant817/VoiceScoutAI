import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface TeamManagementProps {
  teamId: Id<"teams">;
}

export function TeamManagement({ teamId }: TeamManagementProps) {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"admin" | "member">("member");
  
  const teamDetails = useQuery(api.teams.getTeamDetails, { teamId });
  const addMember = useMutation(api.teams.addTeamMember);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    try {
      await addMember({
        teamId,
        email: newMemberEmail.trim(),
        role: newMemberRole,
      });
      
      toast.success("Team member added successfully!");
      setNewMemberEmail("");
      setNewMemberRole("member");
    } catch (error: any) {
      toast.error(error.message || "Failed to add team member");
    }
  };

  if (!teamDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const canManageMembers = teamDetails.userRole === "owner" || teamDetails.userRole === "admin";

  return (
    <div className="space-y-8">
      {/* Team Info */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Team Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
            <div className="text-gray-900">{teamDetails.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <div className="text-gray-900 capitalize">{teamDetails.plan}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
            <div className="text-gray-900">{teamDetails.credits}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
            <div className="text-gray-900">{new Date(teamDetails.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        {teamDetails.description && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="text-gray-900">{teamDetails.description}</div>
          </div>
        )}
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Team Members</h3>
          <span className="text-sm text-gray-500">{teamDetails.members.length} members</span>
        </div>

        <div className="space-y-4">
          {teamDetails.members.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {member.user?.name?.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {member.user?.name || "Unknown User"}
                  </div>
                  <div className="text-sm text-gray-500">{member.user?.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.role === "owner" 
                    ? "bg-purple-100 text-purple-800"
                    : member.role === "admin"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {member.role}
                </span>
                <span className="text-sm text-gray-500">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Form */}
      {canManageMembers && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="colleague@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as "admin" | "member")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Member
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
