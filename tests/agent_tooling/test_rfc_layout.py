import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPOSITORY = Path(__file__).resolve().parents[2]
VALIDATOR = REPOSITORY / "bin" / "validate-rfc-layout"
TEMPLATE = (REPOSITORY / "rfcs" / "TEMPLATE.md").read_text(encoding="utf-8")


class RFCLayoutTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary_directory.cleanup)
        self.repository = Path(self.temporary_directory.name)
        self.rfc_root = self.repository / "rfcs"
        self.rfc_root.mkdir()
        (self.rfc_root / "TEMPLATE.md").write_text(TEMPLATE, encoding="utf-8")

    def run_validator(self):
        return subprocess.run(
            [sys.executable, str(VALIDATOR), str(self.repository)],
            check=False,
            capture_output=True,
            text=True,
        )

    def accepted_rfc(self) -> str:
        text = TEMPLATE.replace("- Status: Draft", "- Status: Accepted")
        text = text.replace("- Owner: Team or individual", "- Owner: Platform")
        text = text.replace("- Approved by: Pending", "- Approved by: Reviewer")
        text = text.replace("- Date: YYYY-MM-DD", "- Date: 2026-09-27")
        text = text.replace(
            "- Outcome: Pending (must be `Approved` before acceptance)",
            "- Outcome: Approved",
        )
        text = text.replace("- Challenger:", "- Challenger: Independent reviewer")
        text = text.replace("- Resolved findings:", "- Resolved findings: None")
        text = text.replace(
            "- Open questions: Pending (must be `None` before acceptance)",
            "- Open questions: None",
        )
        text = text.replace(
            "- Approval reference:", "- Approval reference: pull request review"
        )
        for area in (
            "Compatibility",
            "Failure and recovery",
            "Security and privacy",
            "Data and migration",
            "Concurrency and resources",
            "Operations and observability",
        ):
            text = text.replace(
                f"| {area} | |", f"| {area} | N/A: no change to this area |"
            )
        return text

    def test_complete_accepted_rfc_passes(self):
        (self.rfc_root / "0017-example.md").write_text(
            self.accepted_rfc(), encoding="utf-8"
        )

        result = self.run_validator()

        self.assertEqual(0, result.returncode, result.stderr)

    def test_accepted_rfc_rejects_blank_risk_rows(self):
        text = self.accepted_rfc().replace(
            "| Security and privacy | N/A: no change to this area |",
            "| Security and privacy | |",
        )
        (self.rfc_root / "0017-example.md").write_text(text, encoding="utf-8")

        result = self.run_validator()

        self.assertNotEqual(0, result.returncode)
        self.assertIn("incomplete accepted risk area: Security and privacy", result.stderr)

    def test_accepted_rfc_rejects_unexplained_n_a(self):
        text = self.accepted_rfc().replace(
            "| Data and migration | N/A: no change to this area |",
            "| Data and migration | N/A |",
        )
        (self.rfc_root / "0017-example.md").write_text(text, encoding="utf-8")

        result = self.run_validator()

        self.assertNotEqual(0, result.returncode)
        self.assertIn("must explain why risk area is N/A: Data and migration", result.stderr)

    def test_accepted_rfc_rejects_open_questions(self):
        text = self.accepted_rfc().replace(
            "- Open questions: None", "- Open questions: migration owner"
        )
        (self.rfc_root / "0017-example.md").write_text(text, encoding="utf-8")

        result = self.run_validator()

        self.assertNotEqual(0, result.returncode)
        self.assertIn("must resolve open questions before acceptance", result.stderr)

    def test_accepted_rfc_rejects_pending_approval(self):
        text = self.accepted_rfc().replace(
            "- Approved by: Reviewer", "- Approved by: Pending"
        )
        (self.rfc_root / "0017-example.md").write_text(text, encoding="utf-8")

        result = self.run_validator()

        self.assertNotEqual(0, result.returncode)
        self.assertIn("must name its approver before acceptance", result.stderr)

    def test_accepted_rfc_rejects_pending_approval_reference(self):
        text = self.accepted_rfc().replace(
            "- Approval reference: pull request review",
            "- Approval reference: Pending",
        )
        (self.rfc_root / "0017-example.md").write_text(text, encoding="utf-8")

        result = self.run_validator()

        self.assertNotEqual(0, result.returncode)
        self.assertIn("must record an approval reference before acceptance", result.stderr)

    def test_accepted_rfc_rejects_template_owner(self):
        text = self.accepted_rfc().replace(
            "- Owner: Platform", "- Owner: Team or individual"
        )
        (self.rfc_root / "0017-example.md").write_text(text, encoding="utf-8")

        result = self.run_validator()

        self.assertNotEqual(0, result.returncode)
        self.assertIn("must name its owner before acceptance", result.stderr)

    def test_draft_rfc_allows_incomplete_review_fields(self):
        (self.rfc_root / "0017-example.md").write_text(TEMPLATE, encoding="utf-8")

        result = self.run_validator()

        self.assertEqual(0, result.returncode, result.stderr)

    def test_historical_rfc_format_is_grandfathered(self):
        (self.rfc_root / "0016-historical.md").write_text(
            "# RFC 0016: Historical\n\n- Status: Accepted\n", encoding="utf-8"
        )

        result = self.run_validator()

        self.assertEqual(0, result.returncode, result.stderr)


if __name__ == "__main__":
    unittest.main()
