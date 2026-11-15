package dev.vijay.parking;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ParkingService {
    private final Clock clock;
    private final int capacity;
    private final Map<String, Ticket> parked = new HashMap<>();

    public ParkingService() {
        this(Clock.systemUTC(), 10);
    }

    ParkingService(Clock clock, int capacity) {
        this.clock = clock;
        this.capacity = capacity;
    }

    public synchronized Ticket enter(String plate) {
        String key = normalize(plate);
        if (parked.containsKey(key)) throw new ParkingException("Vehicle is already parked");
        if (parked.size() == capacity) throw new ParkingException("Parking lot is full");
        boolean[] taken = new boolean[capacity + 1];
        parked.values().forEach(ticket -> taken[ticket.slot()] = true);
        int slot = 1;
        while (taken[slot]) slot++;
        Ticket ticket = new Ticket(key, slot, clock.instant());
        parked.put(key, ticket);
        return ticket;
    }

    public synchronized Receipt exit(String plate) {
        Ticket ticket = parked.remove(normalize(plate));
        if (ticket == null) throw new ParkingException("Vehicle is not parked");
        Instant leftAt = clock.instant();
        long minutes = Math.max(0, Duration.between(ticket.enteredAt(), leftAt).toMinutes());
        long hours = Math.max(1, (minutes + 59) / 60);
        return new Receipt(ticket.plate(), ticket.slot(), ticket.enteredAt(), leftAt, hours * 20);
    }

    public synchronized List<Ticket> parked() {
        List<Ticket> result = new ArrayList<>(parked.values());
        result.sort(Comparator.comparingInt(Ticket::slot));
        return result;
    }

    public synchronized int freeSlots() {
        return capacity - parked.size();
    }

    private String normalize(String plate) {
        if (plate == null || plate.isBlank()) throw new ParkingException("Plate is required");
        return plate.trim().toUpperCase();
    }

    public record Ticket(String plate, int slot, Instant enteredAt) {}
    public record Receipt(String plate, int slot, Instant enteredAt, Instant leftAt, long fee) {}
    public static class ParkingException extends RuntimeException {
        public ParkingException(String message) { super(message); }
    }
}
