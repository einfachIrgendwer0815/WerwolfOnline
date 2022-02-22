import { PlayerManagementService } from './player-management.service';

export function initializePlayerManagementService(
  player: PlayerManagementService
) {
  return () => {
    player.initialize();
  };
};
