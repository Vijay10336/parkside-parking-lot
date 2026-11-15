package dev.vijay.parking;

import static org.junit.jupiter.api.Assertions.*;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class ParkingServiceTest {
    @Test
    void reusesSlotAndChargesForStartedHour() {
        ParkingService parking = new ParkingService(Clock.fixed(Instant.parse("2026-01-01T10:00:00Z"), ZoneOffset.UTC), 2);
        assertEquals(1, parking.enter(" ab 123 ").slot());
        assertEquals(2, parking.enter("CD 456").slot());
        assertThrows(ParkingService.ParkingException.class, () -> parking.enter("EF 789"));
        assertEquals(20, parking.exit("AB 123").fee());
        assertEquals(1, parking.enter("EF 789").slot());
    }

    @Test
    void rejectsDuplicateAndUnknownPlate() {
        ParkingService parking = new ParkingService(Clock.systemUTC(), 2);
        parking.enter("AB 123");
        assertThrows(ParkingService.ParkingException.class, () -> parking.enter("ab 123"));
        assertThrows(ParkingService.ParkingException.class, () -> parking.exit("missing"));
    }
}
