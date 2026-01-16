import { useState } from 'react';
import { useAuth } from '../../Auth/context/AuthContext';
import ownerService from '../../Owner/services/ownerService';

export default function PollDisplay({ poll, onVoteSuccess }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasVoted = user && poll.voters?.includes(user.id);
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    const handleVote = async (optionIndex) => {
        if (!user) {
            setError('Please login to vote');
            return;
        }

        if (hasVoted) {
            setError('You have already voted on this poll');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await ownerService.votePoll(poll._id, optionIndex);
            if (onVoteSuccess) {
                onVoteSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit vote');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="poll-card">
            <h3 className="poll-question">{poll.question}</h3>

            {error && (
                <div className="message message-error message-small">
                    {error}
                </div>
            )}

            <div className="poll-options">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0
                        ? Math.round((option.votes / totalVotes) * 100)
                        : 0;

                    return (
                        <div key={index} className="poll-option">
                            <button
                                onClick={() => handleVote(index)}
                                disabled={loading || hasVoted || !poll.isActive}
                                className={`poll-option-button ${hasVoted ? 'voted' : ''}`}
                            >
                                <div className="poll-option-content">
                                    <span className="poll-option-text">{option.text}</span>
                                    <span className="poll-option-votes">
                                        {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                                    </span>
                                </div>
                                {hasVoted && (
                                    <div
                                        className="poll-option-bar"
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}
                            </button>
                            {hasVoted && (
                                <span className="poll-option-percentage">{percentage}%</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="poll-footer">
                <span className="poll-total-votes">
                    Total votes: {totalVotes}
                </span>
                {!poll.isActive && (
                    <span className="poll-status-badge poll-ended">
                        Poll Ended
                    </span>
                )}
                {hasVoted && poll.isActive && (
                    <span className="poll-status-badge poll-voted">
                        ✓ You voted
                    </span>
                )}
            </div>
        </div>
    );
}
