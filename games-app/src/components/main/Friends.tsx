import { useEffect, useState } from "react";
import Header from "../misc/Header";
import "./styles/Layout.css";
import { FriendModel } from "../../models/FriendModel";
import { createFriend, deleteFriend, fetchFriendsByFriend, fetchFriendsByPlayer } from "../../api/FriendApi";
import { PlayerModel } from "../../models/PlayerModel";
import { fetchPlayerById, fetchPlayerByUsername } from "../../api/PlayerApi";
import { InvitationModel } from "../../models/InvitationModel";
import { createInvitation, deleteInvitation, fetchInvitationsByFriend, fetchInvitationsByPlayer } from "../../api/InvitationApi";

const Friends = () => {
    const [friendsFromPlayer, setFriendsFromPlayer] = useState<FriendModel[] | null>(null);
    const [friendsFromFriend, setFriendsFromFriend] = useState<FriendModel[] | null>(null);
    const [user, setUser] = useState<PlayerModel | null>(null);
    const [friendNames, setFriendNames] = useState<PlayerModel[] | null>(null);
    const [invitationFriendNames, setInvitationFriendNames] = useState<PlayerModel[] | null>(null);
    const [invitationsFromFriend, setInvitationsFromFriend] = useState<InvitationModel[] | null>(null);
    const [searchUsername, setSearchUsername] = useState<string>('');

    const fetchFriends = async (userId: string) => {
        try {
            const friendsPlayer = await fetchFriendsByPlayer(userId);
            setFriendsFromPlayer(friendsPlayer);

            const friendsFriend = await fetchFriendsByFriend(userId);
            setFriendsFromFriend(friendsFriend);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchInvitations= async (userId: string) => {
        try{
            const invitationsFriend = await fetchInvitationsByFriend(userId);
            setInvitationsFromFriend(invitationsFriend);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        }
    };

    const handleDeleteFriend = async (friendId: string) => {
        try {
            await deleteFriend(friendId);
            await fetchFriends(user!.id); // Refetch friends after deletion
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    };

    const handleDeleteInvitation = async (invitationId: string) => {
        try{
            await deleteInvitation(invitationId);
            await fetchInvitations(user!.id);
        } catch (error) {
            console.error("Error deleting invitations:", error);
        }
    }

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchUsername(event.target.value);
    };

    const handleInvite = async () => {
        try {
            if (!user) {
                console.error('User is null. Cannot send invitation.');
                return;
            }
            if (!searchUsername) {
                alert("Please enter a username to invite.");
                return;
            }

            const searchUser: PlayerModel = await fetchPlayerByUsername(searchUsername);

            //checking sent invitations
            const searchInvitationsFromPlayer: InvitationModel[] = await fetchInvitationsByFriend(searchUser.id);
            const searchInvitationToPlayer: InvitationModel[] = await fetchInvitationsByPlayer(user.id);
            const searchInvitationsFromPlayerReversed: InvitationModel[] = await fetchInvitationsByFriend(user.id);
            const searchInvitationsToPlayerReversed: InvitationModel[] = await fetchInvitationsByPlayer(searchUser.id);
            
            const existingInvitationFromPlayer = searchInvitationsFromPlayer.find(invitation => invitation.playerId === user.id);
            const existingInvitationToPlayer = searchInvitationToPlayer.find(invitation => invitation.friendId === searchUser.id);
            const existingInvitationsFromPlayerReversed = searchInvitationsFromPlayerReversed.find(invitation => invitation.playerId === searchUser.id);
            const existingInvitationsToPlayerReversed = searchInvitationsToPlayerReversed.find(invitation => invitation.friendId === user.id);
            
            //checking existing friendships
            const searchFriendsFromPlayer: FriendModel[] = await fetchFriendsByFriend(searchUser.id);
            const searchFriendsToPlayer: FriendModel[] = await fetchFriendsByPlayer(user.id);
            const searchFriendsFromPlayerReversed: FriendModel[] = await fetchFriendsByFriend(user.id);
            const searchFriendsToPlayerReversed: FriendModel[] = await fetchFriendsByPlayer(searchUser.id);

            const existingFriendFromPlayer = searchFriendsFromPlayer.find(friend => friend.playerId === user.id);
            const existingFriendToPlayer = searchFriendsToPlayer.find(friend => friend.friendId === searchUser.id);
            const existingFriendFromPlayerReversed = searchFriendsFromPlayerReversed.find(friend => friend.playerId === searchUser.id);
            const existingFriendToPlayerReversed = searchFriendsToPlayerReversed.find(friend => friend.friendId === user.id);

            if(user.nickname === searchUser.nickname){
                alert("Can not invite yourself.");
                return;
            }
            if(existingInvitationFromPlayer || existingInvitationToPlayer
                || existingInvitationsFromPlayerReversed || existingInvitationsToPlayerReversed
            ){
                alert("Invitation already sent.");
                return;
            }
            if(existingFriendFromPlayer || existingFriendToPlayer
                || existingFriendFromPlayerReversed || existingFriendToPlayerReversed
            ){
                alert("Already friends.");
                return;
            }
            await createInvitation({
                id: '',
                playerId: user.id,
                friendId: searchUser.id
            });
            alert(`Invitation sent to ${searchUsername}`);
            setSearchUsername('');
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Error sending invitation. Please try again.');
        }
    };

    const handleAcceptInvitation = async (invitation: InvitationModel) => {
        try {
            await createFriend({
                id: '',
                playerId: invitation.playerId,
                friendId: invitation.friendId,
                friendsSince: new Date()
            });
            
            await handleDeleteInvitation(invitation.id);
            await fetchFriends(user!.id);
            await fetchInvitations(user!.id);
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    };

    useEffect(() => {
        const data = localStorage.getItem('user');
        if (data) {
            const userData: PlayerModel = JSON.parse(data);
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        if (user) {
            // Fetch friends by player ID
            fetchFriendsByPlayer(user.id)
                .then(friendsData => {
                    setFriendsFromPlayer(friendsData);
                })
                .catch(error => {
                    console.error('Error fetching friends by player ID:', error);
                });

            // Fetch friends by friend ID
            fetchFriendsByFriend(user.id)
                .then(friendsData => {
                    setFriendsFromFriend(friendsData);
                })
                .catch(error => {
                    console.error('Error fetching friends by friend ID:', error);
                });

            // Fetch invitations by friend ID
            fetchInvitationsByFriend(user.id)
                .then(invitationData => {
                    setInvitationsFromFriend(invitationData);
                })
                .catch(error => {
                    console.error('Error fetching invitations by friend ID:', error);
                });
        }
    }, [user]);

    useEffect(() => {
        if (user && friendsFromPlayer && friendsFromFriend) {
            const fetchFriendNames = async () => {
                try {
                    // Combine friend IDs from both lists
                    const playerIds = [
                        ...friendsFromPlayer.map(friend => friend.friendId),
                        ...friendsFromFriend.map(friend => friend.playerId)
                    ];
    
                    // Fetch details for all unique friend IDs
                    const uniquePlayerIds = Array.from(new Set(playerIds)); // Remove duplicates
                    const friendDetails = await Promise.all(
                        uniquePlayerIds.map(id => fetchPlayerById(id))
                    );
    
                    setFriendNames(friendDetails);
                } catch (error) {
                    console.error('Error fetching friend details:', error);
                }
            };
    
            fetchFriendNames();
        }
    }, [user, friendsFromPlayer, friendsFromFriend]);

    useEffect(() => {
        if (user && invitationsFromFriend) {
            const fetchInvitationFriendNames = async () => {
                try {
                    const invitationIds = [
                        ...invitationsFromFriend.map(invitation => invitation.playerId)
                    ];
    
                    // Fetch details for all unique friend IDs
                    const uniqueInvitationIds = Array.from(new Set(invitationIds)); // Remove duplicates
                    const invitationDetails = await Promise.all(
                        uniqueInvitationIds.map(id => fetchPlayerById(id))
                    );
    
                    setInvitationFriendNames(invitationDetails);
                } catch (error) {
                    console.error('Error fetching friend details:', error);
                }
            };
    
            fetchInvitationFriendNames();
        }
    }, [user, invitationsFromFriend]);

    return (
        <>
            <Header />
            <div className="friends-parent-container">
                <div className="friends-section">
                    <div>
                        <h1>Friends</h1>
                    </div>

                    <div className="search">
                        <input type="text"
                        placeholder="Type in username..."
                        className="search-input"
                        value={searchUsername}
                        onChange={handleSearchInputChange}></input>
                        <button type="submit" className="search-button" onClick={handleInvite}>Invite</button>
                    </div>

                    <div className="friends-list">
                        <h2>List of friends</h2>
                        {(friendsFromPlayer && friendNames) || (friendsFromFriend && friendNames) ? (
                            <>
                                {friendsFromPlayer && friendsFromPlayer.map(friend => {
                                    const friendName = friendNames.find(fn => fn.id === friend.friendId);
                                    return (
                                        <div key={friend.id} className="friend-card">
                                            <h3 className="friend-card-nickname">{friendName?.nickname}</h3>
                                            <h3 className="friend-card-date">{`Friends since: ${new Date(friend.friendsSince).getFullYear()}-${String(new Date(friend.friendsSince).getMonth() + 1).padStart(2, '0')}-${String(new Date(friend.friendsSince).getDate()).padStart(2, '0')}`}</h3>
                                            <button className="remove-friend" type="submit" onClick={() => handleDeleteFriend(friend.id)}>Remove</button>
                                        </div>
                                    );
                                })}
                                {friendsFromFriend && friendsFromFriend.map(friend => {
                                    const friendName = friendNames.find(fn => fn.id === friend.playerId);
                                    return (
                                        <div key={friend.id} className="friend-card">
                                            <h3 className="friend-card-nickname">{friendName?.nickname}</h3>
                                            <h3 className="friend-card-date">{`Friends since: ${new Date(friend.friendsSince).getFullYear()}-${String(new Date(friend.friendsSince).getMonth() + 1).padStart(2, '0')}-${String(new Date(friend.friendsSince).getDate()).padStart(2, '0')}`}</h3>
                                            <button className="remove-friend" type="submit" onClick={() => handleDeleteFriend(friend.id)}>Remove</button>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <p>Loading friends...</p>
                        )}
                    </div>
                </div>
                <div className="invitations-section">
                    <h2 className="invitations-title">Invitations</h2>
                    {(invitationsFromFriend && invitationFriendNames) ? (
                        <>
                            {invitationsFromFriend && invitationsFromFriend.map(invitation => {
                                const invitationFriendName = invitationFriendNames!.find(fn => fn.id === invitation.playerId);
                                return (
                                    <div key={invitation.id} className="invitation-card">
                                        <h3 className="invitation-card-nickname">{invitationFriendName?.nickname}</h3>
                                        <div className="button-place">
                                            <button className="invitation-button" type="submit" onClick={() => handleAcceptInvitation(invitation)}>
                                                <img className="invitation-image" src="check.png"></img>
                                            </button>
                                            <button className="invitation-button" type="submit" onClick={() => handleDeleteInvitation(invitation.id)}>
                                                <img className="invitation-image" src="delete.png"></img>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <p>Loading invitations...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Friends;
